import React from 'react'

export function Loading() {
    return (
        <section className='hero is-fullheight is-bold is-flex-centered' style={{ alignItems: 'stretch', padding: '2em' }}>
            <div className='hero-body has-text-centered'>
                <div className='container'>
                    <div className='section'>
                        <progress className="progress is-small is-danger" max="100">loading</progress>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function CardFragment({ header, optionsText, children, style }: { header: string, optionsText: any, children?: any, style?: React.CSSProperties }) {
    return (
        <div className="card" style={style}>
            <header className='card-header'>
                <p className='card-header-title'>{header}</p>
                <p className='card-header-icon'>
                    <span>
                        {optionsText}
                    </span>
                </p>
            </header>
            <div className='card-content'>
                <div className='container is-fluid px-0'>
                    {children}
                </div>
            </div>
        </div>
    )
}


export function debounce(func, wait: number, immediate: boolean = false) {
    var timeout;
    return async (...args) => {
        var later = async () => {
            timeout = null;
            if (!immediate) return func(...args)
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) return func(...args)
    };
};