using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Bitmap im = new Bitmap(textBox1.Text);
            int width = im.Width;
            int height = im.Height;
            int uniqueColors = 0;
            string output = "var gen = [\n";
            string output2 = "var pal = {\n";
            Dictionary<string, string> colorMap = new Dictionary<string, string>();
            Dictionary<string, string> colorPallette = new Dictionary<string, string>();
            for (int i = 0; i < width; i++)
            {
                output += "'";
                for (int j = 0; j < height; j++)
                {
                    Color pixelColor = im.GetPixel(i, j);
                    if (pixelColor.A == 0)
                    {
                        output += ".";
                        if (HigherBits.Checked)
                        {
                            output += "~";
                        }
                    }
                    else
                    {
                        string rgba = pixelColor.R + "," + pixelColor.G + "," + pixelColor.B + "," + pixelColor.A;
                        if (colorMap.ContainsKey(rgba))
                        {
                            if (HigherBits.Checked)
                            {
                                output += colorMap[rgba] + "~";
                            }
                            else
                            {
                                output += colorMap[rgba];
                            }                         
                        }
                        else
                        {
                            uniqueColors++;
                            if (HigherBits.Checked)
                            {
                                output += uniqueColors.ToString() + "~";
                            }
                            else
                            {
                                output += uniqueColors.ToString();
                            }
                            colorMap[rgba] = uniqueColors.ToString();
                            colorPallette[uniqueColors.ToString()] = "rgba(" + rgba.ToString() + ")";
                        }
                    }
                    
                }
                output += "',";
                output += "\n";
            }
            output += "];";
            outputBox.Text = output;

            foreach(KeyValuePair<string,string> pair in colorPallette)
            {
                output2 += "'" + pair.Key + "' : '" + pair.Value + "',\n";
            }
            output2 += "};";
            outputBox2.Text = output2;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            openFile.ShowDialog();
            textBox1.Text = openFile.FileName;
        }

    }
}
