using System;
using System.IO;
using System.Linq;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI
{
    class Program
    {
        static string  _cliVersion = "0.90";
        static string  _willcoreUIversion = "0.90";
        static string  _currentDirectory = "C:/";
        static void Main(string[] args)
        {
            Console.Write(@"
 _    _ _ _ _ _____                 _   _ _____ 
| |  | (_) | /  __ \               | | | |_   _|
| |  | |_| | | /  \/ ___  _ __ ___ | | | | | |  
| |/\| | | | | |    / _ \| '__/ _ \| | | | | |  
\  /\  / | | | \__/\ (_) | | |  __/| |_| |_| |_ 
 \/  \/|_|_|_|\____/\___/|_|  \___(_)___/ \___/ 
                                                
                                                
");
            Console.WriteLine("WillCore.UI      Version: 0.9");
            Console.WriteLine("WillCore.UI CLI  Version: 0.9");
            Console.WriteLine("Copyright: Philip Schoeman. License: MIT");
            Console.WriteLine();
            Console.WriteLine("For info on using the CLI, please see WillCore.UI documentation.");
            getFolderDir();
        }

        private static void getFolderDir()
        {
            Console.WriteLine();
            Console.Write("Enter the project's full hosted root directory: ");
            //var project = new Project(@"C:\Users\Philip\source\repos\WillCore.UI\WillCore.UI\wwwroot\template");
            var projectPath = Console.ReadLine();
            if (Directory.Exists(projectPath))
            {
                var project = new Project(projectPath);
                Console.WriteLine($"CLI is now initialized on: {projectPath}.");
                Console.WriteLine("Keep the CLI open while working on the project.");
                Console.WriteLine("Press any key to exit the CLI.");
                Console.ReadKey();
            }
            else
            {
                Console.WriteLine($"Invalid directory path entered.");
                getFolderDir();
            }
        }

        static void welcomeMessage()
        {
            Console.WriteLine($"============================================================================");
            Console.WriteLine($"Welcome WillCore.UI CLI.");
            Console.WriteLine($"You can use this CLI to generate code for views and setup files.");
      
        }

        static void getMainCommand()
        {
            Console.WriteLine();
            Console.WriteLine();
            Console.WriteLine($"Available commands:");
            Console.WriteLine($"Generate code for view : view <viewName>.");
            Console.WriteLine($"Generate code for setup page (index.html) : setup <viewName>.");
            Console.WriteLine($"============================================================================");
            Console.WriteLine();
            Console.WriteLine();
            executeCommand(Console.ReadLine());
        }

        static void executeCommand(string input)
        {
            if (input.Split(' ').Length < 2)
            {
                Console.WriteLine("Please enter valid command.");
                return;
            }
            var command = input.Substring(0, input.IndexOf(" ")).Trim();
            var path = input.Substring(input.IndexOf(" ")).Trim();
            switch (command)
            {
                case "view":
                    createView(path);
                    break;
                case "setup":
                    createSetupPage(path);
                    break;
                default:
                    Console.WriteLine("Please enter valid command.");
                    break;
            }
        }

        static void createView(string path)
        {
          
            File.WriteAllText(path, Resources.view_itemName_html);
            createViewFiles(path);
            getMainCommand();
        }

        static void createViewFiles(string path)
        {
            var viewNameTag = "$safeitemname$";
            Console.WriteLine($"Creating view {path}...");
            var fileName = Path.GetFileNameWithoutExtension(path);
            var fileDirectory = $"{Path.GetDirectoryName(path)}\\{fileName}";
            File.WriteAllText($"{fileDirectory}.js", Resources.view_itemName_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.bindings.js", Resources.view_itemName_bindings_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.collections.js", Resources.view_itemName_collections_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.sources.js", Resources.view_itemName_collections_sources_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.targets.js", Resources.view_itemName_collections_targets_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.traps.js", Resources.view_itemName_collections_traps_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.events.js", Resources.view_itemName_events_js.Replace(viewNameTag, fileName));
            File.WriteAllText($"{fileDirectory}.logic.js", Resources.view_itemName_logic_js.Replace(viewNameTag, fileName));
        }

        static void createSetupPage(string path)
        {
            Console.WriteLine($"Creating setup page {path}");
            getMainCommand();
        }
    }
}
