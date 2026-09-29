<?php
declare(strict_types=1);

namespace App\Config;

final class Environment
{
    public static function load(string $projectRoot): void
    {
        $environmentFile = $projectRoot . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($environmentFile)) {
            return;
        }

        $variables = parse_ini_file($environmentFile, false, INI_SCANNER_RAW);
        if (!is_array($variables)) {
            error_log('No se pudo leer el archivo .env.');
            return;
        }

        foreach ($variables as $name => $value) {
            if (getenv($name) === false && is_string($value)) {
                putenv($name . '=' . $value);
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}