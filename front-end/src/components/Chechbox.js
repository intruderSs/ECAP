import React from "react";

const Checkbox = React.forwardRef(({handleDeleteFromIcon, indeterminate, checked, name, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
        resolvedRef.current.checked = checked
    }, [resolvedRef, indeterminate, checked])


    return (
        <>
            <input ref={resolvedRef} {...rest} checked={checked} name={name} className="form-check-input" type="checkbox" id={name} />
            {checked && <i onClick={handleDeleteFromIcon} className="fa-solid fa-trash table-delete-icon"></i>}
        </>
    )
})

export default Checkbox;