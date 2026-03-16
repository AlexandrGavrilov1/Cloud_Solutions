
-- Fix broken slug in vpn_posts (1 record)
UPDATE t_p4153566_vds_rating_portal.vpn_posts
SET slug = 'lichnyy-vpn-na-hostland-s-openvpn',
    title = 'Личный VPN на Hostland с OpenVPN'
WHERE slug = 'span-class-font-heading-font-bold-text-48px-text-272932-dark-text-white-text-left-личный-span-class-text-ff931f-dark-text-ff931f-vpn-span-на-hostland-быстрый-старт-с-openvpn-span';

-- Fix target_id in events
UPDATE t_p4153566_vds_rating_portal.events
SET target_id = 'lichnyy-vpn-na-hostland-s-openvpn'
WHERE target_id = 'span-class-font-heading-font-bold-text-48px-text-272932-dark-text-white-text-left-личный-span-class-text-ff931f-dark-text-ff931f-vpn-span-на-hostland-быстрый-старт-с-openvpn-span';

-- Fix page_path in events
UPDATE t_p4153566_vds_rating_portal.events
SET page_path = '/vpn/lichnyy-vpn-na-hostland-s-openvpn'
WHERE page_path LIKE '%span-class-font-heading-font-bold-text-48px-text-272932-dark-text-white-text-left%';
