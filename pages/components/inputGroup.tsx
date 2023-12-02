import { ChangeEvent } from 'react';
import { Credentials } from './inteface';

interface InputGroupProps {
    value: string;
    label: string;
    htmlFor: any;
    updateData: any;
}

const InputGroup: React.FC<InputGroupProps> = ({ value, label, htmlFor, updateData }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateData({ [htmlFor]: e.target.value });
    };

    return (
        <div>
            <label htmlFor={htmlFor}>{label}</label>
            <input defaultValue={value} onChange={handleChange} />
        </div>
    );
};

export default InputGroup;