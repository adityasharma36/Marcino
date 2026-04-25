

import './headerMarquee.css'

const message =
    '🏖️ Summer Dream Sweepstakes is NOW LIVE! Sign up today for your chance at over $36,000 in prizes! No purchase necessary. See Official Rules here.'


function HeaderMarquee() {
  return (
    <header className="marquee-banner">
            <div className="marquee-mask">
                <div className="marquee-track">
                    <p className="marquee-text">{message}</p>
                    <p className="marquee-text" aria-hidden="true">
                        {message}
                    </p>
                </div>
            </div>
        </header>
  )
}

export default HeaderMarquee;