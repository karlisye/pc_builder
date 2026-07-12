<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Izmaiņas privātuma politikā / Privacy Policy Update</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border-radius:4px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#374151; padding:24px 32px;">
                            <span style="color:#ffffff; font-size:18px; font-weight:700; letter-spacing:0.05em;">
                                {{ config('app.name') }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 16px; color:#111827; font-size:20px;">
                                Izmaiņas mūsu privātuma politikā
                            </h1>
                            <p style="margin:0 0 24px; color:#475569; font-size:14px; line-height:1.6;">
                                Mēs esam veikuši būtiskas izmaiņas mūsu privātuma politikā. Lūdzu, iepazīstieties ar atjaunināto versiju, noklikšķinot uz pogas zemāk.
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 24px;">

                            <h1 style="margin:0 0 16px; color:#111827; font-size:20px;">
                                Changes to our Privacy Policy
                            </h1>
                            <p style="margin:0 0 24px; color:#475569; font-size:14px; line-height:1.6;">
                                We've made significant changes to our privacy policy. Please review the updated version by clicking the button below.
                            </p>

                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color:#374151; border-radius:2px;">
                                        <a href="{{ $url }}" style="display:inline-block; padding:14px 28px; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none;">
                                            Skatīt politiku / View Policy
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:24px 0 0; color:#94a3b8; font-size:12px; line-height:1.6; word-break:break-all;">
                                {{ $url }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f1f5f9; padding:16px 32px;">
                            <p style="margin:0; color:#94a3b8; font-size:12px;">
                                &copy; {{ date('Y') }} {{ config('app.name') }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
