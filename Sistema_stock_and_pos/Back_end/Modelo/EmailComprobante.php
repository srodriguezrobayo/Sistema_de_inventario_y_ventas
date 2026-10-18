<?php

use PHPMailer\PHPMailer\PHPMailer;

function enviarComprobanteVenta(
    string $destino,
    array $operacion
): void {
    $autoload = __DIR__ . '/../../vendor/autoload.php';
    $configFile = __DIR__ . '/mail_config.local.php';

    if (!is_file($autoload)) {
        throw new RuntimeException('Falta instalar PHPMailer con Composer.');
    }

    if (!is_file($configFile)) {
        throw new RuntimeException('Falta configurar el servidor SMTP.');
    }

    require_once $autoload;
    $config = require $configFile;

    foreach (['host', 'username', 'password', 'from_email'] as $key) {
        if (empty($config[$key])) {
            throw new RuntimeException('La configuración SMTP está incompleta.');
        }
    }

    $seguro = strtolower((string) ($config['encryption'] ?? 'tls'));
    $total = number_format((float) $operacion['total'], 0, ',', '.');
    $esDevolucion = $operacion['tipo'] === 'Devolucion';
    $titulo = $esDevolucion ? 'Comprobante de devolución' : 'Factura de venta';
    $totalTexto = ($esDevolucion ? '-$' : '$') . $total;
    $colorAcento = $esDevolucion ? '#b45309' : '#28756d';
    $nombreSistema = htmlspecialchars(
        (string) ($config['from_name'] ?? 'Stock and POS'),
        ENT_QUOTES,
        'UTF-8'
    );
    $filas = '';
    $textoPlanoItems = [];

    foreach ($operacion['items'] as $item) {
        $nombreOriginal = (string) ($item['nombre'] ?? 'Producto');
        $nombre = htmlspecialchars($nombreOriginal, ENT_QUOTES, 'UTF-8');
        $cantidad = (int) $item['cantidad'];
        $precio = number_format((float) $item['precio'], 0, ',', '.');
        $subtotal = number_format((float) $item['subtotal'], 0, ',', '.');
        $filas .= '<tr>'
            . '<td style="padding:13px 12px;border-bottom:1px solid #e8eeee;color:#243638;font-size:14px;line-height:20px">' . $nombre . '</td>'
            . '<td align="center" style="padding:13px 8px;border-bottom:1px solid #e8eeee;color:#405557;font-size:14px;line-height:20px">' . $cantidad . '</td>'
            . '<td align="right" style="padding:13px 8px;border-bottom:1px solid #e8eeee;color:#405557;font-size:14px;line-height:20px;white-space:nowrap">$' . $precio . '</td>'
            . '<td align="right" style="padding:13px 12px;border-bottom:1px solid #e8eeee;color:#243638;font-size:14px;font-weight:700;line-height:20px;white-space:nowrap">$' . $subtotal . '</td>'
            . '</tr>';
        $textoPlanoItems[] = $nombreOriginal . ' | ' . $cantidad
            . ' x $' . $precio . ' = $' . $subtotal;
    }

    $cajero = htmlspecialchars($operacion['cajero'], ENT_QUOTES, 'UTF-8');
    $factura = htmlspecialchars($operacion['factura'], ENT_QUOTES, 'UTF-8');
    $fecha = htmlspecialchars($operacion['fecha'], ENT_QUOTES, 'UTF-8');
    $etiquetaOperacion = $esDevolucion ? 'DEVOLUCIÓN' : 'VENTA';

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->Port = (int) ($config['port'] ?? 587);
    $mail->Timeout = 20;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    if ($seguro === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } elseif ($seguro === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        throw new RuntimeException('El cifrado SMTP debe ser tls o ssl.');
    }

    $mail->setFrom(
        $config['from_email'],
        $config['from_name'] ?? 'Stock and POS'
    );
    $mail->addAddress($destino);
    $mail->isHTML(true);
    $mail->Subject = $titulo . ' ' . $operacion['factura'];
    $mail->Body = '<!doctype html>'
        . '<html lang="es"><head><meta charset="UTF-8"></head>'
        . '<body style="margin:0;padding:0;background-color:#eef3f3;font-family:Arial,Helvetica,sans-serif;color:#243638">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#eef3f3">'
        . '<tr><td align="center" style="padding:28px 12px">'
        . '<table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background-color:#ffffff;border:1px solid #dfe8e8;border-radius:10px;overflow:hidden">'
        . '<tr><td style="padding:26px 30px;background-color:#23494e;color:#ffffff">'
        . '<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;color:#c7e1df">' . $nombreSistema . '</p>'
        . '<h1 style="margin:0;font-size:25px;line-height:32px;font-weight:700;color:#ffffff">' . $titulo . '</h1>'
        . '<p style="margin:8px 0 0;font-size:13px;line-height:20px;color:#e1eeee">Comprobante de ' . strtolower($etiquetaOperacion) . '</p>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 30px 12px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">'
        . '<tr>'
        . '<td width="50%" valign="top" style="padding:0 12px 14px 0">'
        . '<p style="margin:0 0 5px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#718486">Número de factura</p>'
        . '<p style="margin:0;font-size:15px;font-weight:700;color:#243638">' . $factura . '</p>'
        . '</td>'
        . '<td width="50%" valign="top" style="padding:0 0 14px 12px">'
        . '<p style="margin:0 0 5px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#718486">Fecha y hora</p>'
        . '<p style="margin:0;font-size:14px;color:#243638">' . $fecha . '</p>'
        . '</td>'
        . '</tr>'
        . '<tr><td colspan="2" style="padding:0 0 18px">'
        . '<p style="margin:0 0 5px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#718486">Atendido por</p>'
        . '<p style="margin:0;font-size:14px;color:#243638">' . $cajero . '</p>'
        . '</td></tr>'
        . '</table>'
        . '</td></tr>'
        . '<tr><td style="padding:0 30px 24px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse">'
        . '<thead><tr style="background-color:#f1f6f5">'
        . '<th align="left" style="padding:11px 12px;color:#53696a;font-size:11px;letter-spacing:.4px;text-transform:uppercase">Producto</th>'
        . '<th align="center" style="padding:11px 8px;color:#53696a;font-size:11px;letter-spacing:.4px;text-transform:uppercase">Cant.</th>'
        . '<th align="right" style="padding:11px 8px;color:#53696a;font-size:11px;letter-spacing:.4px;text-transform:uppercase">Precio</th>'
        . '<th align="right" style="padding:11px 12px;color:#53696a;font-size:11px;letter-spacing:.4px;text-transform:uppercase">Subtotal</th>'
        . '</tr></thead><tbody>' . $filas . '</tbody>'
        . '</table>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px;background-color:#f5f8f8;border-radius:8px">'
        . '<tr><td style="padding:17px 18px;color:#405557;font-size:14px;font-weight:700">TOTAL ' . $etiquetaOperacion . '</td>'
        . '<td align="right" style="padding:17px 18px;color:' . $colorAcento . ';font-size:22px;font-weight:700;white-space:nowrap">' . $totalTexto . '</td></tr>'
        . '</table>'
        . '</td></tr>'
        . '<tr><td style="padding:17px 30px;background-color:#f7f9f9;border-top:1px solid #e8eeee;color:#718486;font-size:12px;line-height:18px">'
        . 'Gracias por tu compra. Este correo contiene el comprobante de la operación realizada en ' . $nombreSistema . '.'
        . '</td></tr>'
        . '</table>'
        . '</td></tr></table>'
        . '</body></html>';
    $mail->AltBody = $titulo . ' | Factura: ' . $operacion['factura']
        . ' | Fecha: ' . $operacion['fecha']
        . ' | Atendido por: ' . $operacion['cajero']
        . "\n\nDetalle:\n" . implode("\n", $textoPlanoItems)
        . "\n\nTotal " . strtolower($etiquetaOperacion) . ': ' . $totalTexto;
    $mail->send();
}