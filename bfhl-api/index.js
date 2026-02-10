require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: Replace with your actual Chitkara email
const OFFICIAL_EMAIL = "divyansh1569.be23@chitkara.edu.in"; 

app.use(express.json());
app.use(cors());

// --- LOGIC FUNCTIONS ---

const generateFibonacci = (n) => {
    if (typeof n !== 'number' || !Number.isInteger(n)) {
        throw new Error("Invalid input for 'fibonacci': Expected an Integer.");
    }
    if (n < 0) {
        throw new Error("Invalid input for 'fibonacci': Number must be non-negative.");
    }
    if (n === 0) return [];
    if (n === 1) return [0];
    
    let series = [0, 1];
    while (series.length < n) {
        series.push(series[series.length - 1] + series[series.length - 2]);
    }
    return series;
};

const filterPrimes = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Invalid input for 'prime': Expected an Array.");
    }
    if (arr.some(item => !Number.isInteger(item))) {
        throw new Error("Invalid input for 'prime': Array must contain only Integers.");
    }
    
    const isPrime = (num) => {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    };
    return arr.filter(num => isPrime(num));
};

const gcd = (a, b) => (!b ? a : gcd(b, a % b));

const calculateHCF = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Invalid input for 'hcf': Expected an Array.");
    }
    if (arr.length === 0) {
        throw new Error("Invalid input for 'hcf': Array cannot be empty.");
    }
    if (arr.some(item => !Number.isInteger(item))) {
        throw new Error("Invalid input for 'hcf': Array must contain only Integers.");
    }
    return arr.reduce((a, b) => gcd(a, b));
};

const lcm = (a, b) => (a * b) / gcd(a, b);

const calculateLCM = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Invalid input for 'lcm': Expected an Array.");
    }
    if (arr.length === 0) {
        throw new Error("Invalid input for 'lcm': Array cannot be empty.");
    }
    if (arr.some(item => !Number.isInteger(item))) {
        throw new Error("Invalid input for 'lcm': Array must contain only Integers.");
    }
    return arr.reduce((a, b) => lcm(a, b));
};

const getAIResponse = async (question) => {
    if (typeof question !== 'string') {
        throw new Error("Invalid input for 'AI': Expected a String.");
    }
    if (!question.trim()) {
        throw new Error("Invalid input for 'AI': Question string cannot be empty.");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Server Configuration Error: GEMINI_API_KEY is missing.");
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Prompt specifically asks for digits if the answer is a number
        const prompt = `${question} \n\nStrict instruction: Answer in a single word. If the answer is a number, use digits (e.g. 4).`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        // Regex allows letters AND numbers (0-9)
        return text.split(" ")[0].replace(/[^a-zA-Z0-9]/g, ""); 
    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("External AI Service Error: Failed to fetch response.");
    }
};

// --- ROUTES ---

app.get('/health', (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL
    });
});

app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);
        const allowedKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
        
        const presentAllowedKeys = keys.filter(k => allowedKeys.includes(k));

        // ERROR: No valid keys
        if (presentAllowedKeys.length === 0) {
            return res.status(400).json({
                is_success: false,
                official_email: OFFICIAL_EMAIL,
                message: "No valid key found. Please provide exactly one of: fibonacci, prime, lcm, hcf, AI."
            });
        }

        // ERROR: Multiple valid keys
        if (presentAllowedKeys.length > 1) {
            return res.status(400).json({
                is_success: false,
                official_email: OFFICIAL_EMAIL,
                message: `Ambiguous request. You provided multiple keys (${presentAllowedKeys.join(', ')}). Please provide exactly one.`
            });
        }

        const key = presentAllowedKeys[0];
        const value = body[key];
        let data;

        // Switch to handle logic
        switch (key) {
            case 'fibonacci': data = generateFibonacci(value); break;
            case 'prime':     data = filterPrimes(value); break;
            case 'lcm':       data = calculateLCM(value); break;
            case 'hcf':       data = calculateHCF(value); break;
            case 'AI':        data = await getAIResponse(value); break;
        }

        // SUCCESS RESPONSE
        res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: data
        });

    } catch (error) {
        // ERROR RESPONSE
        res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});