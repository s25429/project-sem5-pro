import React from 'react'

import '../../css/ReportBug.css'
import Footer from '../../components/Footer'


function ReportBug() {
    return (
        <>
            <h2>Widzisz jakiś błąd? <br />Zgłoś go do Nas!</h2>
            <form onSubmit={e => e.preventDefault()}>
                <section>
                    <label htmlFor="reason">Czego błąd dotyczy?</label>
                    <input type="text" name="reason" id="reason" />
                </section>
                <section>
                    <label htmlFor="description">Opisz go dokładniej.</label>
                    <textarea name="description" id="description" cols="30" rows="10"></textarea>
                </section>
                <button type="submit">Wyślij</button>
            </form>
            <Footer />
        </>
    )
}


export default ReportBug