
const PersonForm = ({ name, number, setName, setNumber, onSubmit }) => {

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                Name: <input id='name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                Number: <input id='number' value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>
                <div>
                <button type="submit">
                    Add Contact
                </button>
                </div>
                
            </form>
        </div>
    )
}

export default PersonForm