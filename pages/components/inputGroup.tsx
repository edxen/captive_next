import { ChangeEvent } from 'react';
import { Credentials } from './inteface';

interface InputGroupProps {
    value: string | number | undefined;
    label: string;
    htmlFor: any;
    updateCredentials: (value: Partial<Credentials>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ value, label, htmlFor, updateCredentials }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const partialUpdate: Partial<Credentials> = {
            [htmlFor]: e.target.value
        };
        updateCredentials(partialUpdate);
    };

    return (
        <div>
            <label htmlFor={htmlFor}>{label}</label>
            <input defaultValue={value} onChange={handleChange} />
        </div>
    );
};

export default InputGroup;