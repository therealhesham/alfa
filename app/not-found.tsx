"use client";

import Link from "next/link";
import Image from "next/image";
import { defaultLocale } from "@/i18n";

export default function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-hero">
        <div className="not-found-content">
          <Image
          //center logo
          style={{ display: 'block', margin: '0 auto' }}
            src="https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"
            alt="City Shadows Logo"
            width={200}
            height={200}
            className="not-found-logo"
            unoptimized
          />
          <div className="not-found-number">
            <span>404</span>
          </div>
          <h1>الصفحة غير موجودة</h1>
          <p>عذراً، الصفحة التي تبحث عنها غير موجودة. قد تكون تم نقلها أو حذفها.</p>
          <Link href={`/${defaultLocale}/home`} className="not-found-button">
            العودة إلى الرئيسية
          </Link>
        </div>
        <div className="not-found-decoration">
          <div className="architectural-line line-1"></div>
          <div className="architectural-line line-2"></div>
          <div className="architectural-line line-3"></div>
          <div className="architectural-line line-4"></div>
        </div>
      </div>

      <style jsx>{`
        .not-found-wrapper {
          min-height: 100vh;
          background: linear-gradient(rgba(250, 247, 242, 0.85), rgba(232, 217, 192, 0.95)),
            url('/BG.jpg') center/cover no-repeat;
          position: relative;
          overflow: hidden;
        }

        .not-found-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(250, 247, 242, 0.3) 0%, rgba(232, 217, 192, 0.5) 100%);
          z-index: 0;
        }

        .not-found-hero {
          min-height: 100vh;
          padding: 80px 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 0 2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .not-found-logo {
          margin-bottom: 2rem;
          filter: drop-shadow(0 10px 30px rgba(15, 28, 42, 0.15));
          animation: fadeInUp 0.8s ease-out;
        }

        .not-found-number {
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .not-found-number span {
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(8rem, 20vw, 15rem);
          font-weight: 900;
          color: #D4C19D;
          line-height: 1;
          display: block;
          text-shadow: 0 10px 40px rgba(212, 193, 157, 0.3);
          letter-spacing: -0.05em;
        }

        .not-found-content h1 {
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(2rem, 6vw, 4rem);
          color: #0F1C2A;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .not-found-content p {
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          color: #0F1C2A;
          opacity: 0.85;
          margin-bottom: 2.5rem;
          line-height: 1.8;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .not-found-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: #0F1C2A;
          color: #FAF7F2;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 2px solid #0F1C2A;
          animation: fadeInUp 0.8s ease-out 0.8s both;
          box-shadow: 0 4px 15px rgba(15, 28, 42, 0.2);
          font-family: 'Tajawal', sans-serif;
        }

        .not-found-button:hover {
          background: #D4C19D;
          color: #0F1C2A;
          border-color: #D4C19D;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 193, 157, 0.4);
        }

        .not-found-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.08;
        }

        .architectural-line {
          position: absolute;
          background: #0F1C2A;
          border-radius: 2px;
        }

        .line-1 {
          width: 2px;
          height: 60%;
          top: 20%;
          right: 15%;
          animation: drawLineVertical 1.5s ease-out 1s both;
        }

        .line-2 {
          width: 2px;
          height: 50%;
          top: 25%;
          left: 20%;
          animation: drawLineVertical 1.5s ease-out 1.3s both;
        }

        .line-3 {
          width: 40%;
          height: 2px;
          top: 30%;
          right: 10%;
          animation: drawLineHorizontal 1.5s ease-out 1.6s both;
        }

        .line-4 {
          width: 35%;
          height: 2px;
          bottom: 30%;
          left: 15%;
          animation: drawLineHorizontal 1.5s ease-out 1.9s both;
        }

        @keyframes drawLineVertical {
          from {
            transform: scaleY(0);
            transform-origin: top;
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            transform-origin: top;
            opacity: 0.08;
          }
        }

        @keyframes drawLineHorizontal {
          from {
            transform: scaleX(0);
            transform-origin: right;
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            transform-origin: right;
            opacity: 0.08;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .not-found-hero {
            padding: 60px 4%;
          }

          .not-found-logo {
            width: 150px;
            height: 150px;
          }

          .not-found-number span {
            font-size: clamp(6rem, 25vw, 10rem);
          }

          .not-found-content {
            padding: 0 1rem;
          }

          .not-found-button {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .not-found-hero {
            padding: 50px 3%;
          }

          .not-found-logo {
            width: 120px;
            height: 120px;
          }

          .not-found-number span {
            font-size: clamp(5rem, 30vw, 8rem);
          }

          .not-found-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}

