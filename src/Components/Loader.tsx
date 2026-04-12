import logo from '../logo.svg';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-wrapper">
        <img src={logo} alt="Loading" className="loader-logo" />
        <div className="loader-text">
          Loading
          <span className="loader-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
