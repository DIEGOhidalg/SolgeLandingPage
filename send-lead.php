<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

function field(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

function clean_header(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

if (field('website') !== '') {
    echo json_encode(['ok' => true, 'message' => 'Solicitud recibida.']);
    exit;
}

$names = field('names');
$whatsapp = field('whatsapp');
$email = field('email');
$company = field('company');
$teamSize = field('team_size');
$message = field('message');

$errors = [];

if ($names === '') {
    $errors[] = 'Ingresa tu nombre.';
}

if ($whatsapp === '') {
    $errors[] = 'Ingresa tu WhatsApp.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Ingresa un email valido.';
}

if ($company === '') {
    $errors[] = 'Ingresa el nombre de tu empresa.';
}

if ($teamSize === '' || !ctype_digit($teamSize) || (int)$teamSize < 1) {
    $errors[] = 'Ingresa el numero de personas de tu empresa.';
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => implode(' ', $errors)]);
    exit;
}

$recipients = [
    'diegohidalgoalvear@gmail.com',
    'phidalgo@solgeambiental.cl',
];

$subject = 'Nuevo lead SolGe Ambiental - Licitaciones Huella de Carbono';
$submittedAt = date('Y-m-d H:i:s');

$body = implode("\n", [
    'Nuevo contacto desde solgeambiental.cl',
    '',
    'Nombre: ' . $names,
    'Empresa: ' . $company,
    'Numero de personas: ' . $teamSize,
    'WhatsApp: ' . $whatsapp,
    'Email: ' . $email,
    '',
    'Licitacion o requisito:',
    $message !== '' ? $message : 'Sin mensaje adicional.',
    '',
    'Fecha servidor: ' . $submittedAt,
]);

$headers = [
    'From: SolGe Ambiental <no-reply@solgeambiental.cl>',
    'Reply-To: ' . clean_header($names) . ' <' . clean_header($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    implode(',', $recipients),
    $subject,
    $body,
    implode("\r\n", $headers)
);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'No pudimos enviar tu solicitud. Escríbenos por WhatsApp o intenta nuevamente.',
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'Solicitud enviada correctamente.',
]);
