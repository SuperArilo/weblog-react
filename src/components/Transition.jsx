import { useRef } from 'react'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import '../assets/scss/currencyTransition.scss'

export function CTransitionFade({ keyS, timeout = 300, left, right }) {
    const leftRef = useRef(null)
    const rightRef = useRef(null)
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition key={keyS} classNames='change' timeout={timeout} nodeRef={keyS ? leftRef:rightRef} mountOnEnter={true} unmountOnExit={true}>
                {
                    keyS ?
                    <div ref={leftRef}>
                        {left}
                    </div>
                    :
                    <div ref={rightRef}>
                        {right}
                    </div>
                }
            </CSSTransition>
        </SwitchTransition>
    )
}
export function CTransitionGroup({ children }) {
    return (
        <TransitionGroup>
            {children}
        </TransitionGroup>
    )
}
export function CCSSTransition({ children, status }) {
    const ref = useRef(null)
    return (
        <CSSTransition in={status} timeout={300} classNames="mask-fade" nodeRef={ref} mountOnEnter={true} unmountOnExit={true}>
            <div ref={ref}>
                {children}
            </div>
        </CSSTransition>
    )
}