-- 1. Исправляем slug в vpn_posts
UPDATE t_p4153566_vds_rating_portal.vpn_posts
SET slug = 'vpn-na-sprinthost-wireguard'
WHERE slug = 'собственный-vpn-на-спринтхост-https-sprinthost-ru-s43965-просто-и-безопасно-с-wireguard';

-- 2. Исправляем target_id в events
UPDATE t_p4153566_vds_rating_portal.events
SET target_id = 'vpn-na-sprinthost-wireguard'
WHERE target_id = 'собственный-vpn-на-спринтхост-https-sprinthost-ru-s43965-просто-и-безопасно-с-wireguard';

-- 3. Исправляем page_path в events
UPDATE t_p4153566_vds_rating_portal.events
SET page_path = '/vpn/vpn-na-sprinthost-wireguard'
WHERE page_path LIKE '%собственный%'
   OR page_path LIKE '%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%';

-- 4. Убеждаемся что provider_name правильный
UPDATE t_p4153566_vds_rating_portal.vpn_posts
SET provider_name = 'SprintHost'
WHERE slug = 'vpn-na-sprinthost-wireguard';