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