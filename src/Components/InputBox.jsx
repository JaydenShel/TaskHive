import PropTypes from 'prop-types';

function TextBox({ label, type = 'text', required, value, onChange }) {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return (
        <div>
            <label className="label">{label}:</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}

// Define prop types for validation
TextBox.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default TextBox;
