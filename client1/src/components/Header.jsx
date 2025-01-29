function Header() {
    return (
      <div>
        <nav className="nav">
          <div className="nav-left">
            <a className="brand" href="#">
                BPlan Tasks
            </a>
          </div>
          <div className="nav-right">
            <div className="tabs">
              <a href="https://codebetaplan.com/">Task Management App by Betaplan</a>
            </div>
          </div>
        </nav>
      </div>
    );
}
  
export default Header;