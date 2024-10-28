import { Request, Response } from "express";

class TranslationController {
  async getTranslation(req: Request, res: Response) {
    const inputCode = req.body.inputCode;
    const inputLang = req.body.inputLang;
    const outputLang = req.body.outputLang;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (inputLang === outputLang) {
      return res.status(200).send({
        output: inputCode,
      });
    }
    const prompt = `Translate the following code snippet to the specified target programming language.
                
    Instructions:
    0. In case of compiled languages, check if there's any compiler error in input code, if so return that error message only, don't convert.
    1. Add any required imports or headers for the target language (e.g., in C++ use #include <bits/stdc++.h> or other necessary headers or for Typescript include proper datatypes for each initialized variable, if not possible mark as any).
    2. Use concise, clean comments only where necessary to enhance understanding—avoid long explanations.
    3. Follow clean code principles to ensure readability and maintainability in the translated code.
    4. Optimize for best practices in the target language where appropriate.
    5. Add proper error handlings.
    Current Language: ${inputLang}
    Target Language: ${outputLang}
    Code Snippet to Translate: ${inputCode}
    Please make sure the response is strictly as per the given instructions.
    `;

    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH",
            },
          ],
          generationConfig: {
            stopSequences: ["Title"],
            temperature: 1.0,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 10,
          },
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const output = data.candidates[0].content.parts[0].text;
        // Remove the backticks and any additional line breaks
        const cleanText = output.replace(/```(?:\w+)?\n?|```$/g, "").trim();
        return res.status(200).send({
          output: cleanText,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        return res.status(500).send({
          output: "Something went wrong while translation, please try again.",
        });
      });
  }
}

export default TranslationController;
