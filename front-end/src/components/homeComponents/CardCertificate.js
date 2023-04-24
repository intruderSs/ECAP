import React from "react";
import a from "../../images/a.png";

function CardCertificate() {
    return (
        <>
            <div className="col-md-3 mb-3">
                <div className="card my-3 border-light bg-light cert-details">
                    <div className="cert-image">
                        <img src={a} className="card-img-top" alt="..." />
                    </div>
                    <div className="card-body">
                        <p className="card-text">This certification validates cloud fluency and foundational AWS knowledge.</p>
                        <hr />
                        <p className="card-text"><strong>Exam Price: </strong>100 USD</p>
                        <hr />
                        <div className="accordion" id="accordionExample">
                            <div>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <p className="card-text"><strong>Languages: </strong>English, French (France), German, Indonesian, Italian, Japanese, Korean, Portuguese (Brazil), Simplified Chinese, and Spanish (Latin America)</p>
                                    <hr />
                                    <p className="card-text"><strong>Testing Options: </strong>Pearson VUE testing center or online proctored exam</p>
                                    <button id="lm-btn" className="btn btn-sm">Learn more »</button>
                                </div>
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    </button>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardCertificate;