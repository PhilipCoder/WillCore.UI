using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI.FileLogic
{
    public static class PathHelper
    {
        public static bool IsHtml(string fileName)
        {
            return String.Equals(Path.GetExtension(fileName), ".html", StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsJS(string fileName)
        {
            return String.Equals(Path.GetExtension(fileName), ".html", StringComparison.OrdinalIgnoreCase);
        }

        public static bool Allowed(string fileName)
        {
            var extention = Path.GetExtension(fileName);
            return String.Equals(extention, ".html", StringComparison.OrdinalIgnoreCase) || String.Equals(extention, ".js", StringComparison.OrdinalIgnoreCase);
        }

        public static string GetMetaString(string commentPath)
        {
            return File.Exists(commentPath) ? File.ReadAllText(commentPath) : Resources.view_itemName_meta_js;
        }

        public static string GetMetaFilePath(string filePath)
        {
            var fileName = Path.GetFileNameWithoutExtension(filePath);
            if (fileName.Contains(".")) fileName = fileName.Substring(0,fileName.IndexOf("."));
            return Path.Combine(Path.GetDirectoryName(filePath), $"{fileName}.meta.js");
        }

        public static string GetSolutionDirectory(string workingDirectory)
        {
            while (workingDirectory != null)
            {
                if (Directory.EnumerateFiles(workingDirectory, "*.sln").Any()) return workingDirectory;
                workingDirectory = Directory.GetParent(workingDirectory).FullName;
            }
            return null;
        }

        public static string GetRelativePathToWorkingDirectory(string filePath)
        {
            var fileDirectory = Path.GetDirectoryName(filePath);
            var path = Path.GetRelativePath(Settings.WorkingDirectory, fileDirectory).Replace("\\", "/");
            if (path.StartsWith(".")) path = path.Substring(1);
            if (!path.EndsWith("/")) path = $"{path}/";
            if (!path.StartsWith("/")) path = $"/{path}";
            return path;
        }

    }
}
