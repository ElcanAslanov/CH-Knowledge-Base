import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Giriş tələb olunur' },
        { status: 401 }
      )
    }

    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const { data: userData, error: userCheckError } =
      await supabaseUser.auth.getUser()

    if (userCheckError || !userData.user?.email) {
      return NextResponse.json(
        { error: 'İstifadəçi yoxlanıla bilmədi' },
        { status: 401 }
      )
    }

    const requesterEmail = userData.user.email.toLowerCase().trim()

    const { data: adminCheck, error: adminCheckError } = await supabaseUser
      .from('admin_emails')
      .select('id')
      .eq('email', requesterEmail)
      .eq('is_active', true)
      .single()

    if (adminCheckError || !adminCheck) {
      return NextResponse.json(
        { error: 'Bu əməliyyat üçün icazəniz yoxdur' },
        { status: 403 }
      )
    }

    const { email, password } = await req.json()
    const normalizedEmail = String(email || '').toLowerCase().trim()

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Email və şifrə tələb olunur' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifrə minimum 6 simvol olmalıdır' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    })

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      )
    }

    const { error: dbError } = await supabaseAdmin
      .from('admin_emails')
      .upsert(
        {
          email: normalizedEmail,
          is_active: true,
        },
        { onConflict: 'email' }
      )

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server xətası' },
      { status: 500 }
    )
  }
}