import OpenAI from "openai";

const openai = new OpenAI();

async function writeJournal(answer1, answer2, answer3) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: `
      You are an experienced chef who can summarize answers to questions from user input. 
      You are writing a journal entry based on answers. Make the entry feel organic while maintaining correctness based on the answers.` },
      { role: "user", content: `Here are my answers to the questions:
        Q: Who invented this recipe and when is it usually made?
        A: ${answer1}
        Q: What is a memory that you associate with this recipe?
        A: ${answer2}
        Q: What makes this recipe unique in your family?
        A: ${answer3}
        `}],
    model: "gpt-4o-mini",
    max_tokens: 1024
  });

  console.log(completion.choices[0].message.content);
}

writeJournal("My mother created this recipe and we eat this during Eid celebrations as an item for brunch.",
  "Eating my mom’s samosa always reminds of the warmness and excitement that surrounds the holiday of Eid. She would already be up early working hard on brunch before anyone else would be up. The rest of the family would get up a bit later and start helping out. I would always help my mom roll out the samosa dough and help her fill them. She would also make 3 different chutneys that pair really well with the samosas. My entire family always craves my mom’s samosas and always looks forward to the next time we would have them.",
  "My mother creates her own unique spice blend or masala that she uses in this recipe. She adds more cumin seed and turmeric than is typical. My family is originally from the Punjab area of Pakistan and that is reflected in the spice blend that we created."
);