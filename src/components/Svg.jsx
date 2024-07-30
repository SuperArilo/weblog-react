import { useEffect, useState } from "react"
export default function Svg(props) {
    const [Component, setComponent] = useState(null)
    useEffect(() => {
        if(props.name == null) return
        import(`../assets/svg/${props.name}.svg?react`).then(resp => setComponent(<resp.default { ...props } />))
    }, [props.name])
    useEffect(() => {
        if(Component == null || props == null || props.name == null) return
        setComponent(i => ({
            ...i,
            props: props
        }))
    }, [props])
    return Component
}