import "./Company.css"

export function Company(props) {
    const regions = props.company.regions?.join(" · ");
    return <div key={"k-" + props.company.id} className="company" role="listitem" >
        <a href={props.company.website}> </a>
        <div className='company-child logo'>
            <img alt='logo' className="company-image" src={props.company.smallLogoUrl} />
        </div>
        <div className='company-child information'>
            <div>
                <span className='company-name'> {props.company.name}</span>
                <span className='company-location'> {regions} </span>
            </div>
            <div>
                <span className='company-description'>{props.company.oneLiner}</span>
            </div>
        </div>
    </div >
}


