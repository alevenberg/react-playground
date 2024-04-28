import "./Company.css"
import { v4 as uuidv4 } from 'uuid';

export function Company(props) {
    const regions = props.company.regions?.join(" · ");
    return <div key={"k-" + props.company.id} className="company" role="listitem" >
        <a href={props.company.url}> </a>
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
            <div>
                <div className='company-pill-wrapper'>
                    <span className="company-pill-batch" >{props.company.batch} </span>
                    {props.company.industries.map((industry, idx) => (
                        <span key={uuidv4()} className="company-pill">
                            {industry}</span>))}
                </div>
            </div>
        </div>
    </div >
}


