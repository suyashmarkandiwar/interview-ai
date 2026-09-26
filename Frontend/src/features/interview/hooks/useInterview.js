import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [isDownloading, setIsDownloading] = useState(false)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Failed to generate Interview Plan. Please try again.")
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReport : null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReport : null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReports : []
    }

    const getResumePdf = async (interviewReportId) => {
        setIsDownloading(true)
        let response = null
        try {
            const htmlString = await generateResumePdf({ interviewReportId })
            // Inject a floating Print button and a script
            const printScript = `
                <style>
                    @media print { .no-print { display: none !important; } }
                    .print-btn {
                        position: fixed; top: 20px; right: 20px; 
                        background: #e11d48; color: white; border: none; 
                        padding: 12px 24px; border-radius: 8px; 
                        font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        z-index: 9999; font-family: sans-serif; font-size: 16px;
                    }
                    .print-btn:hover { background: #be123c; }
                </style>
                <button class="no-print print-btn" onclick="window.print()">🖨️ Save as PDF</button>
                <script>setTimeout(() => window.print(), 1000);</script>
            `;
            const htmlWithPrint = htmlString + printScript;
            
            // Create a Blob from the HTML string and open it in a new tab
            const blob = new Blob([htmlWithPrint], { type: 'text/html' })
            const url = window.URL.createObjectURL(blob)
            
            // Open the resume in a new tab, which will automatically ask to Save as PDF
            window.open(url, "_blank")
        }
        catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Failed to generate Resume. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, isDownloading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
