
function LoaderSmall() {
  return (
    <div className="col-md-12 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  );
}

export default LoaderSmall;