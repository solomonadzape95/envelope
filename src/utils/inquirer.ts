import inquirer from "inquirer"

export async function ask(message: string, name: string) {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name,
            message
        }
    ]);
    return answers[name];
}