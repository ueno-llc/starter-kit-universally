import React from 'react';
import ReactGA from 'react-ga';

function scripts({ facebookPixel, twitterPixel }) {

  const facebook = `
    // Facebook Pixel
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${facebookPixel}');`;

  const twitter = `
    // Twitter Pixel
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    twq('init','${twitterPixel}');`;

  return {
    facebook,
    twitter,
  };
}

export default class Analytics {
  constructor(args) {
    Object.assign(this, args);
    this.scripts = scripts(args);
  }

  get facebook() {
    return this.scripts.facebook;
  }

  get twitter() {
    return this.scripts.twitter;
  }

  get facebookNoscript() {
    return (
      <noscript>
        <img
          src={`https://www.facebook.com/tr?id=${this.facebookPixel}&ev=PageView&noscript=1`}
          style={{ display: 'none' }}
          alt=""
          height="1"
          width="1"
        />
      </noscript>);
  }
}

export function gaPageView(path) {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
}

export function fbPageView() {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function twPageView() {
  if (window.twq) {
    window.twq('track', 'PageView');
  }
}
