
const Filter = ({ filter, onFilter }) => {
    
    return (
        <section>
            <div>
                <h3>Filter</h3>
                Filter shown with <input value={filter} onChange={onFilter}  />
            </div>
        </section>
    )
}

export default Filter