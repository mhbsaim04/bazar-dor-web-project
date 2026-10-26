import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand"><Link href="/" className="footer-logo"><span><Image src="/logo-icon.png" alt="logo-image" width={20}
                    height={20}></Image></span> বাজার দর<span className="brand-dot">।</span></Link><p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p></div>
            <div className="footer-notice"><p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></div>
            
          </div>
        </footer>
    );
};

export default Footer;