using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI.FileLogic
{
    public static class JSCreator
    {
        public static void CreateLayout(string fullPath, string viewName, string indexFile)
        {
            try
            {
                View.Create(fullPath);
                var indexJS = Path.ChangeExtension(indexFile, ".js");
                if (indexFile != null && File.Exists(indexJS))
                {
                    var fileContents = File.ReadAllText(indexJS);
                    string path = PathHelper.GetRelativePathToWorkingDirectory(fullPath);
                    fileContents = $"{fileContents}\r\n//willCore.{viewName.Substring(1)} = [layout, \"{path}{viewName}.js\", \"{path}{viewName}.html\"];";
                    File.WriteAllText(indexJS, fileContents);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred while writing file. Exception:");
                Console.Write(e.Message);
            }
        }

        public static void CreateView(string fullPath, string viewName, string indexFile)
        {
            try
            {
                View.Create(fullPath);
                var indexJS = Path.ChangeExtension(indexFile, ".js");
                if (indexFile != null && File.Exists(indexJS))
                {
                    var fileContents = File.ReadAllText(indexJS);
                    if (fileContents.Contains("willCore(\"/\")")) {
                        string path = PathHelper.GetRelativePathToWorkingDirectory(fullPath);
                        fileContents = fileContents.Insert(fileContents.IndexOf("willCore(\"/\")"), $"\r\n//willCore.{viewName} = [willCore.$mainContentDiv, url, \"{path}{viewName}.js\", url, \"{path}{viewName}.html\", route,\"/\", x=>true];\r\n");
                        File.WriteAllText(indexJS, fileContents);
                    }
                    else
                    {
                        Console.WriteLine("Invalid index file.");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred while writing file. Exception:");
                Console.Write(e.Message);
            }
        }

        public static void WriteNestingConfig()
        {
            try
            {
                if (Settings.SolutionDirectory != null)
                {
                    var filePath = Path.Combine(Settings.SolutionDirectory, ".filenesting.json");
                    if (!File.Exists(filePath))
                    {
                        File.WriteAllBytes(filePath, Resources._filenesting);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred while writing file. Exception:");
                Console.Write(e.Message);
            }
        }
    }
}
