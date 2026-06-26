'use client';

import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '5491123456789'; // Default Argentine phone number
  const message = '¡Hola! Estoy interesado en armar un teclado mecánico customizado y me gustaría recibir asesoramiento técnico.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-[#25d366]/30 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contactar por WhatsApp"
        title="Asesoramiento por WhatsApp"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full border border-[#25d366]/30 animate-ping opacity-75 pointer-events-none group-hover:animate-none" />
        
        {/* Official WhatsApp Logo SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="h-6.5 w-6.5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.528 2.013 14.07 1.01 11.5 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.39 1.359 4.876l-.993 3.63 3.771-.976zm10.19-5.466c-.287-.144-1.7-.84-1.964-.937-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.129-.168.193-.336.216-.624.072-.288-.144-1.215-.447-2.313-1.427-.854-.762-1.43-1.702-1.598-1.99-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.472-.487-.648-.496-.168-.008-.36-.008-.552-.008-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.643.606.69.219 1.319.188 1.815.114.553-.083 1.7-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z"/>
        </svg>
      </a>
    </div>
  );
}
