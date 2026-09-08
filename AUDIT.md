# PIXELPLAY — аудит сайта

## 1. Executive Summary

Текущий `main` представляет собой рабочий Next.js-сайт сети компьютерных клубов PIXEL с десятью публичными маршрутами. P0-проблем не обнаружено, основные P1-задачи закрыты. SEO, базовая accessibility, централизация данных, media pipeline и CI находятся в рабочем состоянии.

Остались отдельные P2/P3-задачи hardening и polish: дальнейшая оптимизация hero video, контраст вторичного текста и проверка предположений HSTS preload.

**Audit status: READY FOR FINAL POLISH**

## 2. Current Project State

- **Стек:** Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind CSS 4, Framer Motion, Node.js 22.
- **Архитектура:** App Router; общий public shell с `Navbar`/`Footer`; `/partners` намеренно использует отдельный microsite shell и client island `PartnersInteractive`.
- **Данные:** клубы и характеристики централизованы в `lib/site-data.ts`; `maxRefreshRate` вычисляется из этих данных; адрес Pixel Metro — `пер. Мигая, 13`.
- **Публичные маршруты:** `/`, `/clubs`, `/partners`, `/pricing`, `/games`, `/promos`, `/rules`, `/services`, `/specs`, `/terms`.
- **CI:** GitHub Actions запускает `npm ci`, lint и production build для `main`.

## 3. Closed Issues

### SEO

- Добавлены root и route-specific metadata.
- Используются canonical URLs, Open Graph и Twitter metadata.
- Добавлены `app/robots.ts` и `app/sitemap.ts`.
- В проекте нет намеренного `noindex`.
- Добавлены Organization structured data в public layout.

SEO следует считать в основном закрытым пунктом, а не P1-проблемой.

### Performance и media

- `public/hero-desktop.mp4` уменьшен примерно до 11.49 MB.
- Видео — H.264 Main, 1920×1080, 30 fps, без аудио, примерно 2.5 Mbps.
- Desktop hero video не загружается на мобильных viewport.
- Изображения используют WebP/AVIF-стратегию Next.js.
- `next.config.mjs` включает `formats: ["image/webp", "image/avif"]`, `minimumCacheTTL: 60`, `compress: true`, `poweredByHeader: false`, `reactStrictMode: true` и оптимизацию импортов Framer Motion.

### Security

- Next.js обновлён до 16.3.4; `eslint-config-next` синхронизирован на 16.3.4.
- CSP hardened: удалён `unsafe-eval`; `unsafe-inline` сохранён осознанно из-за текущих inline styles и Next.js runtime-поведения.
- Удалён устаревший `X-XSS-Protection`.
- Сохранены `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, Referrer-Policy и Permissions-Policy.
- CSP сохраняет необходимые базовые разрешения без расширения ненужных источников.

### Accessibility и UX

- Mobile menu использует `aria-expanded`, `aria-controls`, `aria-label`, Escape handling и возвращает focus к trigger.
- Mobile menu удерживает Tab и Shift+Tab внутри открытого меню и возвращает focus к trigger при закрытии или навигации.
- Selectors используют `aria-pressed`.
- Есть общие `:focus-visible` стили.
- `MotionConfig reducedMotion="user"` используется.

### Data, navigation и architecture

- Данные клубов централизованы.
- Верхняя правая кнопка `Связаться` удалена; социальные ссылки сохранены.
- `/partners` оставлен отдельным microsite shell с одним client island.
- Статичные страницы существенно оптимизированы по client/server boundaries.
- Footer year вычисляется динамически через `new Date().getFullYear()`.

## 4. Remaining Issues

### P1

Нет подтверждённых P1-проблем.

### P2

- **Hero video:** ресурс около 11.5 MB остаётся главным media/performance-рискoм; возможна дальнейшая оптимизация без ухудшения desktop-опыта.
- **WCAG contrast:** провести отдельную проверку контраста вторичного текста.
- **HSTS preload:** пересмотреть только после подтверждения, что все необходимые поддомены проекта работают исключительно через HTTPS.

### P3

Нет подтверждённых обязательных P3-изменений. Дополнительные content/architecture polish-задачи можно выполнять только при появлении конкретного требования.

## 5. Route Matrix

| Route | UX | Mobile | SEO | Accessibility | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | PASS | PASS | PASS | PASS | READY |
| `/clubs` | PASS | PASS | PASS | PASS | READY |
| `/partners` | PASS | PASS | PASS | PASS | READY |
| `/pricing` | PASS | PASS* | PASS | PASS | READY |
| `/games` | PASS | PASS | PASS | PASS | READY |
| `/promos` | PASS | PASS | PASS | PASS | READY |
| `/rules` | PASS | PASS | PASS | PASS | READY |
| `/services` | PASS | PASS | PASS | PASS | READY |
| `/specs` | PASS | PASS | PASS | PASS | READY |
| `/terms` | PASS | PASS | PASS | PASS | READY |

`PASS*` означает оставшуюся точечную проверку polish: естественный горизонтальный scroll pricing-таблицы на узких экранах.

## 6. Security

### Dependencies

- Next.js: `16.3.4`.
- `eslint-config-next`: `16.3.4`.
- React major/minor не изменялись.
- `npm audit --omit=dev` чистый: 0 vulnerabilities.

### Headers и CSP

Текущий `proxy.ts` отдаёт:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

CSP включает `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: https:`, `font-src 'self' data:`, `connect-src 'self'`, `frame-ancestors 'none'`, `base-uri 'self'` и `form-action 'self'`. `unsafe-eval` удалён. `unsafe-inline` оставлен из-за текущего Next.js/inline-style/runtime поведения. HSTS с `preload` сохранён; его уместно пересмотреть только после подтверждения subdomain assumptions.

## 7. Performance

- Hero video: примерно 11.49 MB, H.264 Main, 1920×1080, 30 fps, без аудио, около 2.5 Mbps.
- На мобильных viewport desktop video не должно загружаться.
- Изображения обслуживаются через Next.js image strategy с WebP/AVIF.
- Включены compression и `minimumCacheTTL: 60`.
- Client/server boundaries уже частично/существенно оптимизированы; отдельные интерактивные острова сохранены там, где они нужны.
- Главный оставшийся performance P2 — дальнейшая media optimization hero video.

## 8. SEO

- Есть root metadata и route-specific metadata.
- Есть canonical URLs для маршрутов.
- Есть Open Graph и Twitter metadata.
- Есть `app/robots.ts` и `app/sitemap.ts`.
- Нет намеренного `noindex`.
- Public layout содержит Organization JSON-LD.

SEO закрыт на базовом production-уровне. Дальнейшее расширение structured data — необязательная рекомендация, не критическая проблема.

## 9. Accessibility

Закрытые базовые пункты: ARIA-состояния mobile menu и selectors, Escape handling, focus trap и возврат focus к trigger, `:focus-visible`, reduced-motion configuration. Partners modal также использует focus trap, Escape и возврат focus к trigger.

Остаются:

- отдельная проверка контраста вторичного текста по WCAG.

## 10. Recommended Roadmap

### Phase 3A — remaining security/audit cleanup

1. Подтвердить, что все необходимые subdomains совместимы с HSTS preload.

### Phase 3B — accessibility polish

1. Провести контрастную проверку вторичного текста.

### Phase 3C — media/performance polish

1. Оценить дальнейшее уменьшение hero video примерно 11.5 MB.
2. Сохранить poster-only/mobile поведение и проверить desktop visual quality.

### Phase 3D — optional architecture/content cleanup

1. Выполнять только подтверждённые content или architecture улучшения.
2. Не возвращать закрытые SEO, data и navigation issues в backlog без новых доказательств.

**Audit status: READY FOR FINAL POLISH**
