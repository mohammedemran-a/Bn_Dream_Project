<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // 👇 ضع هنا عنوان تطبيقك React أو Flutter Web
    'allowed_origins' => ['http://localhost:8081'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // 👇 ضروري للسماح بالكوكيز
    'supports_credentials' => true,

];
