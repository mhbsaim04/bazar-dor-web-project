import Link from "next/link";
import React from 'react';

const NotFound = () => {
    return (
        <main className="container route-main">
            <div className="not-found-card"><span className="not-found-code">৪০৪</span><span className="not-found-emoji">🔎</span><h1>আপনার খোঁজা পেজটি পাওয়া যায়নি</h1><p>লিংকটি ভুল হতে পারে, অথবা পেজটি সরিয়ে ফেলা হয়েছে।</p><Link href="/" className="button button-primary button-large">হোম পেজে ফিরে যান ↗</Link></div></main>
    );
};

export default NotFound;



