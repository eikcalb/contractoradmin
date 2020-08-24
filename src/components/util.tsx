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
                <div className='container'>
                    {children}
                </div>
            </div>
        </div>
    )
}