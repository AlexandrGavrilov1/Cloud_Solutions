// src/data/vpn-posts.ts

export interface VpnPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  datePublished?: string;
  dateModified?: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  views: number;
  // Поля для кнопки перехода к провайдеру
  providerUrl?: string;
  providerName?: string;
}

export const vpnPosts: VpnPost[] = [
  {
    id: 1,
    slug: "personalnyj-vpn-na-aeza",
    title: "Запускаем персональный VPN на Aeza.net за 10 минут",
    excerpt:
      "Пошаговая инструкция по развертыванию своего VPN сервера на базе XRay с Reality. Подходит для iOS, Android, Windows.",
    //author: "Команда TopCloudHub",
    date: "13.02.2026",
    datePublished: "2026-02-13T12:00:00+03:00",
    dateModified: "2026-02-13T12:00:00+03:00",
    readTime: "8 мин",
    category: "VPN",
    tags: ["VPN", "Aeza", "XRay", "Reality", "Самостоятельный хостинг"],
    image: "/VPN/pictures/01_vpn_aeza_preview.png",
    //views: 0,
    providerUrl: "https://aeza.net/?ref=766003",
    providerName: "Aeza.net",
    content: `
Итак, приступим к запуску персонального VPN на [Aeza.net](https://aeza.net/?ref=766003).

Берем виртуальную машину на Ubuntu. Дальше нам нужно зайти на эту машину и настроить ее. Обычно на хостингах нам будет дан ip сервера и пароль от root.

### 1. Подключение к серверу

Заходим по ssh:

\`\`\`bash
ssh root@<ip>
\`\`\`

Далее копируем и вставляем пароль (он не будет отображаться при вставке).

### 2. Начальная настройка безопасности

Первым делом настраиваем доступ к машине и фаервол. Создадим своего пользователя, под которым будем заходить в будущем:

\`\`\`bash
useradd -G root -m diphantxm -s /bin/bash
\`\`\`

Запретим вход под root, разрешим аутентификацию по публичному ключу и запретим вход по паролю:

\`\`\`bash
sed -i "s/PermitRootLogin yes/PermitRootLogin no/g" /etc/ssh/sshd_config
sed -i "s/PubkeyAuthentication no/PubkeyAuthentication yes/g" /etc/ssh/sshd_config
sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config
\`\`\`

Настроим фаервол (ufw). По умолчанию запретим весь входящий трафик, откроем порт для SSH и порт 443 для нашего приложения:

\`\`\`bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 22
ufw allow 443
ufw enable
ufw reload
\`\`\`

### 3. Установка XRay

Скачиваем и устанавливаем XRay:

\`\`\`bash
wget https://github.com/XTLS/Xray-core/releases/download/v25.3.6/Xray-linux-64.zip
unzip Xray-linux-64.zip
chmod +x xray
mv xray /usr/bin/xray
\`\`\`

Создаем systemd сервис для автоматического запуска:

\`\`\`bash
cat > /lib/systemd/system/xray.service <<EOF
[Unit]
Description=XRay Service
After=network.target nss-lookup.target

[Service]
User=root
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/bin/xray run -config /etc/xray/config.json
Restart=on-failure
RestartPreventExitStatus=23

[Install]
WantedBy=multi-user.target
EOF
\`\`\`

Генерируем ключи для Reality (приватный и публичный):

\`\`\`bash
xray x25519
\`\`\`

Сохраните выведенные ключи. Приватный понадобится в конфиге сервера, публичный — клиентам.

### 4. Конфигурация XRay

Создаем файл конфигурации \`/etc/xray/config.json\`. Замените \`<СЮДА ВСТАВЛЯЕМ ...>\` на свои значения.

\`\`\`json
{
    "inbounds": [
        {
            "tag": "input",
            "port": 443,
            "listen": "0.0.0.0",
            "protocol": "vless",
            "settings": {
                "clients": [
                    {
                        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    }
                ],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "tcp",
                "security": "reality",
                "realitySettings": {
                    "show": false,
                    "dest": "github.com:443",
                    "privateKey": "YOUR_PRIVATE_KEY",
                    "serverNames": ["github.com"],
                    "shortIds": [""],
                    "type": "tcp"
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "tag": "direct",
            "settings": {
                "domainStrategy": "UseIP"
            }
        },
        {
            "protocol": "blackhole",
            "tag": "block"
        }
    ]
}
\`\`\`

- **id** – сгенерируйте UUID (например, через команду \`cat /proc/sys/kernel/random/uuid\`).
- **privateKey** – вставьте свой приватный ключ, полученный ранее.

### 5. Запуск XRay

\`\`\`bash
systemctl start xray.service
systemctl enable xray.service
\`\`\`

Проверьте статус: \`systemctl status xray.service\`.

Наша прокси слушает порт 443.

### 6. Подключение клиентов

Чтобы подключиться, понадобится приложение:

- **Android / iOS**: V2Box
- **Windows**: V2rayN

Настройка клиента (на примере iOS):

1. Откройте V2Box, нажмите **+** → **Add manual config**.
2. Выберите тип **VLESS**.
3. Заполните параметры:
   - Адрес сервера: ваш IP
   - Порт: 443
   - UUID: тот же, что указан в конфиге сервера
   - Security: reality
   - Server name: github.com
   - Public key: ваш публичный ключ
   - Short ID: оставьте пустым

![Пример конфигурации клиента](/VPN/pictures/02_config_example.png)

### 7. Готово!

Теперь ваш личный VPN работает. Весь трафик будет шифроваться и проходить через ваш сервер на Aeza.

![VPN работает](/VPN/pictures/03_app_for_ios.png)

---

## Заключение

Мы развернули безопасный VPN на собственном сервере всего за несколько минут. Преимущества такого подхода:
- Полный контроль над трафиком
- Отсутствие ограничений по скорости (кроме канала сервера)
- Можно подключать сколько угодно устройств

Попробуйте сами – арендуйте сервер у [Aeza.net](https://aeza.net/?ref=766003) и следуйте инструкции.

[**Перейти на Aeza.net**](https://aeza.net/?ref=766003)
`,
  },
  // Сюда можно добавлять другие статьи с провайдерами
];

export const vpnCategories = ["Все", "VPN", "Инструкции", "Безопасность"];
