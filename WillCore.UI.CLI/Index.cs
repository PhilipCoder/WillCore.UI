using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI
{
    public static class Index
    {
        public static void Create(String path)
        {
            var viewNameTag = "$safeitemname$";
            Console.WriteLine($"Creating view {path}...");
            var fileName = Path.GetFileNameWithoutExtension(path);
            var fileDirectory = $"{Path.GetDirectoryName(path)}\\{fileName}";
            File.WriteAllText($"{fileDirectory}.js", Resources.index);
            File.WriteAllText(path, Resources.index1);
        }
    }
}
