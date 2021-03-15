import React, { ReactChild } from 'react'
import { FaExclamationCircle } from 'react-icons/fa';

export function Empty({ content, icon, onDismiss, text, ...props }: { text?: string, content?: ReactChild, icon?: ReactChild, onDismiss?: any, children?: ReactChild }) {
    return (
        <div className='notification px-4 is-light is-uppercase is-warning has-text-centered'>
            {!!onDismiss && <button onClick={onDismiss} className='delete'></button>}
            {icon ? icon :
                <FaExclamationCircle className='has-text-warning-dark is-size-4 mb-2' />
            }
            {props.children ?
                props.children :
                content ? content :
                    <p className='block has-text-grey is-size-7'>{text || 'No data'}</p>
            }
        </div>
    )
}

export function Loading() {
    return (
        <section className='hero is-fullheight is-bold is-flex-centered' style={{ alignItems: 'stretch', padding: '2em' }}>
            <div className='hero-body is-flex-centered has-text-centered'>
                <div className='column is-4 is-12-mobile'>
                    <div className='section px-6'>
                        <progress className="progress is-small is-danger" max="100">loading</progress>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function CardFragment({ header, optionsElement, optionsText, onOptionsTextClick, children, style }: { header: string, optionsElement?: React.ReactChild, optionsText?: any, onOptionsTextClick?: any, children?: any, style?: React.CSSProperties }) {
    return (
        <div className="card" style={style}>
            <header className='card-header'>
                <p className='card-header-title'>{header}</p>
                <p className='card-header-icon'>
                    {optionsElement ?
                        optionsElement :
                        <span className='has-text-link' onClick={onOptionsTextClick}>
                            {optionsText}
                        </span>
                    }
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

export async function wait(duration = 5000) {
    await new Promise((res) => {
        setTimeout(res, duration)
    })
}

export const useEscapeHandler = (callback: any) => {
    const handler = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
            callback()
        }
    }
    window.document.addEventListener('keydown', handler)
    return () => window.document.removeEventListener('keydown', handler)
}