import { useState } from 'react'

export enum FieldType {
    TEXT = 'text',
    PASSWORD = 'password'
}

const useField = (type: FieldType) => {
    const [value, setValue] = useState('')

    const onChange = (event: React.FormEvent<HTMLInputElement> ):void => {
        setValue(event.currentTarget.value)
    }

    // const reset = ():string => {
    //     setValue('')
    //     return 'null'
    // }

    return {
        type,
        value,
        onChange,
    }
}

export default useField
