
const Persons = ({ showPersons, onDeleteContact }) => {

    return (
        <ul>
            {showPersons.map(person => 
                <li key={person.name}>
                    {person.name} {person.number} <button onClick={() => onDeleteContact(person.id)}>Delete</button>
                </li>
            )}
        </ul>
    )
}

export default Persons