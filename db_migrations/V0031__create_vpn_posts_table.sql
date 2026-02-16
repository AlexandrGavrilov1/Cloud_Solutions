
CREATE TABLE t_p4153566_vds_rating_portal.vpn_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    author VARCHAR(255) NOT NULL DEFAULT '',
    date VARCHAR(50) NOT NULL DEFAULT '',
    date_published VARCHAR(50),
    date_modified VARCHAR(50),
    read_time VARCHAR(50) NOT NULL DEFAULT '',
    category VARCHAR(100) NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    image VARCHAR(500),
    views INTEGER NOT NULL DEFAULT 0,
    provider_url VARCHAR(500),
    provider_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем существующую статью
INSERT INTO t_p4153566_vds_rating_portal.vpn_posts (
    id, slug, title, excerpt, content, date, date_published, date_modified,
    read_time, category, tags, image, views, provider_url, provider_name
) VALUES (
    1,
    'personalnyj-vpn-na-aeza',
    'Запускаем персональный VPN на Aeza.net за 10 минут',
    'Пошаговая инструкция по развертыванию своего VPN сервера на базе XRay с Reality. Подходит для iOS, Android, Windows.',
    '',
    '13.02.2026',
    '2026-02-13T12:00:00+03:00',
    '2026-02-13T12:00:00+03:00',
    '8 мин',
    'VPN',
    ARRAY['VPN', 'Aeza', 'XRay', 'Reality', 'Самостоятельный хостинг'],
    '/VPN/pictures/01_vpn_aeza_preview.png',
    14,
    'https://aeza.net/?ref=766003',
    'Aeza.net'
);

SELECT setval(pg_get_serial_sequence('t_p4153566_vds_rating_portal.vpn_posts', 'id'), 
    (SELECT MAX(id) FROM t_p4153566_vds_rating_portal.vpn_posts));
