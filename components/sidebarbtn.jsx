
const SidebarBTN = (props) => (
    <div className="sidebar-link" onClick={props.onClick}>
    {props.icon}
    <span>
    {props.text}
    </span>
    </div>

)
export default SidebarBTN;