import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import html2pdf from "html2pdf.js"


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
            
            // Generate a true PDF directly in the browser and download it as a file
            const opt = {
                margin:       0.5,
                filename:     'AI_Generated_Resume.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            
            // Create a temporary element to hold the HTML
            const element = document.createElement('div');
            element.innerHTML = htmlString;
            
            await html2pdf().set(opt).from(element).save();
            
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
