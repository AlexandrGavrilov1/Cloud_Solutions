
-- Fix broken title/slug for Beget VPN post
UPDATE t_p4153566_vds_rating_portal.vpn_posts
SET slug = 'beget-vpn-bezopasnyy-lichnyy-server-za-5-minut',
    title = 'Beget VPN: безопасный личный сервер за 5 минут'
WHERE slug = 'beget-vpn-быстрый-и-безопасный-личный-сервер-за-5-минут';

-- Fix target_id in events
UPDATE t_p4153566_vds_rating_portal.events
SET target_id = 'beget-vpn-bezopasnyy-lichnyy-server-za-5-minut'
WHERE target_id = 'beget-vpn-быстрый-и-безопасный-личный-сервер-за-5-минут';

-- Fix page_path in events (stored URL-encoded)
UPDATE t_p4153566_vds_rating_portal.events
SET page_path = '/vpn/beget-vpn-bezopasnyy-lichnyy-server-za-5-minut'
WHERE page_path = '/vpn/beget-vpn-%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9-%D0%B8-%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D1%8B%D0%B9-%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B9-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%D0%B7%D0%B0-5-%D0%BC%D0%B8%D0%BD%D1%83%D1%82';
