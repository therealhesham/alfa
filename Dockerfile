# استخدام صورة Node.js الرسمية كصورة أساسية
FROM node:20-alpine AS base

# تثبيت التبعيات فقط عند الحاجة
FROM base AS deps
# تثبيت libc6-compat و openssl لبعض الحزم التي تحتاجها
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# نسخ ملفات التبعيات
COPY package.json package-lock.json* ./
# تثبيت التبعيات
RUN npm ci

# بناء التطبيق
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# توليد Prisma Client
RUN npx prisma generate

# تعطيل telemetry في Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# بناء التطبيق للإنتاج
RUN npm run build

# صورة الإنتاج - تحتوي فقط على الملفات المطلوبة للتشغيل
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# تثبيت openssl لـ Prisma
RUN apk add --no-cache openssl

# إنشاء مستخدم غير root للأمان
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات المطلوبة من وضع standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# نسخ Prisma schema و client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

# فتح المنفذ
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# تشغيل التطبيق
CMD ["node", "server.js"]

