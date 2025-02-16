const fs = require("node:fs").promises;
const chalk = require("chalk");
const { error } = require("node:console");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const path = `${__dirname}\\tasks.txt`;

const userInput = (message) => {
  return new Promise((res) => {
    rl.question(`\n${chalk.blue(message)}`, (ans) => {
      res(ans);
    });
  });
};

const addTask = async () => {
  let task;
  try {
    task = await userInput("Write Task To Be Added —> ");
    await fs.access(path);
    await fs.appendFile("tasks.txt", `\n${task.toLowerCase().trim()}`, "utf8");
  } catch (err) {
    await fs.writeFile("tasks.txt", task.toLowerCase().trim(), "utf8");
  }
  console.log("\n" + chalk.green("TASK ADDED SUCCESSFULLY"));
};

const viewTask = async () => {
  try {
    let tasks = await fs.readFile("tasks.txt", "utf8");
    tasks = tasks.trim();
    if (!tasks) throw new error("EMPTY");
    console.log(chalk.cyanBright("\n" + chalk.cyanBright(tasks.toUpperCase())));
  } catch (err) {
    console.log("\n" + chalk.red("TASKS ARE NOT ADDED YET"));
  }
};

const markCompleteTask = async () => {
  let taskToMark;
  try {
    taskToMark = await userInput(
      chalk.blue("TYPE THE TASK WHICH SHOULD BE MARKED AS COMPLETE —> ")
    );
    taskToMark = taskToMark.toLowerCase().trim();
    await fs.access(path);
    const data = await fs.readFile("tasks.txt", "utf8");
    const dataArr = data.split("\n");
    let idx = dataArr.findIndex((ele) => ele === taskToMark);
    if (idx === -1)
      throw new error(`\nTASK ${taskToMark.toUpperCase()} DIDN'T EXISTS`);
    dataArr[idx] = `${dataArr[idx]}✅`;
    await fs.writeFile("tasks.txt", dataArr.join("\n"), "utf8");
    console.log(chalk.green("\nTASK MARKED COMPLETED SUCCESSFULLY"));
  } catch (err) {
    console.log(chalk.red("\n" + err));
  }
};

const removeTask = async () => {
  let taskToRemove;
  try {
    taskToRemove = await userInput(
      "WRITE THE TASK THAT YOU WANT TO REMOVE —> "
    );
    taskToRemove = taskToRemove.toLowerCase().trim();
    await fs.access(path);
    const data = await fs.readFile("tasks.txt", "utf8");
    const dataArr = data.split("\n");
    const idx = dataArr.findIndex((ele) => ele.includes(taskToRemove));
    if (idx === -1)
      throw new error(`\n${taskToRemove.toUpperCase()} TASK DIDN'T EXISTS`);
    dataArr.splice(idx, 1);
    await fs.writeFile("tasks.txt", dataArr.join("\n"), "utf8");
    console.log(
      "\n" +
        chalk.green(`\n${taskToRemove.toUpperCase()} TASK REMOVED SUCCESSFULLY`)
    );
  } catch (err) {
    console.log(chalk.red("\n" + err));
  }
};

const TODO = async () => {
  while (true) {
    console.log("\n" + chalk.yellow("1 —> Add a task"));
    console.log(chalk.yellow("2 —> View list of tasks"));
    console.log(chalk.yellow("3 —> Mark a task as complete"));
    console.log(chalk.yellow("4 —> Remove a task"));
    console.log(chalk.yellow("5 —> Exit"));

    const ans = await userInput("TYPE A NO. TO PERFORM THE SPECIFIED TASK —> ");

    switch (parseInt(ans)) {
      case 1:
        await addTask();
        break;
      case 2:
        await viewTask();
        break;
      case 3:
        await markCompleteTask();
        break;
      case 4:
        await removeTask();
        break;
      case 5:
        process.exit();
      default:
        console.log(chalk.red("\nCHOOSE CORRECT TASK TO DO (from 1 to 5)"));
    }
  }
};

TODO();